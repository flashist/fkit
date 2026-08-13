# Worklog — task 0252: `RELEASING.md`

**Agent:** `fkit-coder`, spawned as the Build worker of `/fkit-sprint-ship-loop`.
**Date:** 2026-08-13. **Tree at start:** `HEAD = 1c82cbf`, `origin/main = 1c82cbf`.
**Authority:** the approved plan carried verbatim in the spawn prompt (declared-approval marker;
owner approved via `AskUserQuestion` in the driver session, with rulings on Q1–Q3 and the `_fkit_reinstall`
disposition). The plan is the standing approval **and** the scope boundary.

---

## 1. Change surface — exactly as scoped

| File | Change |
|---|---|
| `RELEASING.md` | **New**, repo root. 5 sections + preamble. 29 distinct `file:line` citations, all swept (V1). |
| `ai-agents/knowledge-base/architecture.md` | **+2 lines** appended to flow "6 — Release". Zero removed lines. |
| `ai-agents/tasks/backlog/0252-…/worklog.md` | **New** (this file). |

`plan.md` was **not** touched — the driver authored it at plan approval; plan §2 step 5 was already
discharged. ⛔ Not re-authored, not edited.

**File count is two** (plus this worklog), per the owner's Q1 ruling: **no `README.md` change**;
`0253` owns the README work.

---

## 2. Corrections to the approved plan — claims that failed verification

The spawn prompt directed: *"If any factual claim in the plan turns out to be wrong when you check
it, say so and correct the document."* Three did. All three are stated here rather than absorbed
silently.

### C1 — ⚠️ **The plan's "CI has still never run" is FALSIFIED. CI has run five times and is green.**

Plan §0.5 asserts: *"⚠️ CI has still never run. No commits have been pushed by this work … `RELEASING.md`
says 'wired, not yet observed green.'"* — and instructs ⛔ *do not write that CI works.*

**Measured this turn** (`gh run list --limit 20`):

```
completed  success  Wiki update   test  main  push  31705888986  4m6s   2026-08-13T13:37:59Z
completed  success  Sprint push   test  main  push  31699017902  4m3s   2026-08-13T12:13:15Z
completed  success  Sprint push   test  main  push  31698378442  4m8s   2026-08-13T12:04:48Z
completed  success  Sprint push   test  main  push  31683821470  3m56s  2026-08-13T08:50:00Z
completed  failure  Sprint push   test  main  push  31634593615  49s    2026-08-12T19:50:01Z
```

Corroborating: `git rev-parse HEAD origin/main` → both `1c82cbf`; four commits landed on `main` after
`test.yml` was added in `df55b50`. The newest green run is exactly `1c82cbf` ("Wiki update").

The 2026-08-12 red run was a real catch — `test/orphan-cleanup.test.js:264`, *"the never-delete-lockdown-state
guard is case-insensitive"*, `AssertionError … expected /lockdown state/, actual ''`, on the runner. Fixed;
the four runs since are green.

**Action taken:** wrote the verified truth. `RELEASING.md` §4 states that CI runs on push/PR/dispatch,
has been exercised on real pushes, and has already caught a failure a local run had not. The §5
residual slot the plan reserved for CI now holds a **different, verified** residual: **`install.sh`
itself is untested** — confirmed by `grep -ln 'install\.sh' test/*.js test/*.sh` returning nothing,
and consistent with `architecture.md` §9.1's own heading (*"`install.sh` is still uncovered"*).

⚠️ Had the plan been followed literally, `RELEASING.md` would have shipped a false claim — the exact
failure mode this task exists to end. That is why the instruction was overridden. **This is the item
most worth a second pair of eyes.**

### C2 — the `fkit update` self-erasing-pin rationale was **deliberately not written**

Plan §1 approved this clause for the tag paragraph: *"and `fkit update` will not keep an install pinned
there (§0.2)"*, with §4 naming *"§0.2's self-erasing-pin fact as the concrete reason"*.

The owner then **folded that defect into `0284`**. Writing a defect's current behavior as a document's
permanent rationale would go stale the moment `0284` lands — the plan's own §0.1/§0.4 lesson.

**Action taken:** the tag paragraph keeps its "reachable, not supported" verdict but rests it on a
**defect-independent** fact, verified this turn: `install.sh:69` records the ref into `.version`, and
the update check resolves that ref's head via `git ls-remote` (`claude/fkit-claude.sh:79-91`). A tag's
head never moves, so an install pinned to one has nothing to update to — the update check is
permanently silent. **True before `0284`, true after.** No mention of `_fkit_reinstall`, `0284`, or the
propagation defect appears in `RELEASING.md`.

### C3 — line numbers: three off-by-ones in the plan, corrected at write time

| Plan says | Actual (2026-08-13) |
|---|---|
| `architecture.md:413-417` = flow 6 paragraph | **`:412-416`** (heading `:412`; protected sentence `:415-416`) |
| `workingTreeFiles()` `:259-295` | **`:259-296`** |
| `.gitkeep` skip `:288` | **`:288`** ✓ (plan correct; my first draft wrote `:289` — **V1 caught it**) |
| `test/structure-manifest.test.js:114` = the "→ fix:" line | **`:115`** |

Also confirmed: `bin/release.mjs:160-174`, `:167-174`, `:175-192`, `:143-147`→**`:143-149`**, tag at `:213`,
create/push tag `:259-263`. `0254`'s shipped edit is at **`:276`** — below every span cited, so it shifted
nothing, as the prompt anticipated. Confirmed rather than assumed.

---

## 3. Findings surfaced, not fixed (out of scope — reported per the ⛔)

1. **`ai-agents/knowledge-base/architecture.md:415` carries a stale citation.** It attributes *"No
   npm-registry publish"* to `bin/release.mjs:66`; line 66 is now `--no-tag`. The claim actually lives at
   **`bin/release.mjs:77`**. ⛔ **Not fixed** — it is inside the protected sentence's line range and
   correcting it would produce a removed line, failing V5. `RELEASING.md` cites `:77` correctly.
2. **`architecture.md` §9.1 says "eight `node --test` contract suites"**; `test/` now holds **21**
   `.test.js` files. Stale. Out of this task's scope.
3. **`npm test` runtime figure — sixth data point.** Measured here: **435 s (7:15.03)**. Full series:
   328 / 344 / 347 / 380 (brief) / 463 (driver) / **435** (this run) → observed span **5:28 – 7:43**.
   The owner-ruled wording *"roughly 6–8 minutes, machine-dependent"* is honest as a budget, but its
   **floor sits ~30 s above the fastest observed run**. Noted for the producer; ⛔ not changed — the
   owner ruled the wording explicitly. CI on `ubuntu-latest` is markedly faster (~4 min).
4. **`plan.md` §3's V2 grep over-expects.** `grep -n 'FKIT_REF:-main' claude/fkit-claude.sh` matches
   **nothing** — the launcher's form is `${FKIT_REF:-$(_fkit_verfield ref)}` then `${fkit_ref:-main}`
   (`:106`). Not a document defect: `RELEASING.md` describes `:106` as resolving the same default *when
   `.version` names no ref*, which is exactly right. Flagged so the V2 output below is not misread.
5. **`_fkit_reinstall` propagation defect** (plan §0.2) — ⛔ untouched, per the owner's ruling folding it
   into `0284`. `claude/fkit-claude.sh` was read only, never written.

---

## 4. Verification — all eight checks, real output

### V1 — every `file:line` citation printed back from disk

Run at repo root over `RELEASING.md`. **29 distinct citations. First pass found 2 hard fails; both
fixed by correcting the citation, not by rewording.**

- `bin/generate-structure-manifest.mjs:289` printed `out.push([...])`, not the `.gitkeep` skip → corrected to **`:288`**.
- `bin/release.mjs:232-263` did **not** contain the version bump the document listed as step 1 → widened to **`:200-263`** (bump is at `:200-207`).

Re-swept clean:

```
ok   .github/workflows/test.yml:16-20        ok   bin/release.mjs:167-174
ok   .github/workflows/test.yml:3-11         ok   bin/release.mjs:175-192
ok   .github/workflows/test.yml:33           ok   bin/release.mjs:194-197
ok   .github/workflows/test.yml:38-42        ok   bin/release.mjs:200-263
ok   ai-agents/knowledge-base/architecture.md:415
ok   bin/generate-structure-manifest.mjs:259-296   ok   bin/release.mjs:213
ok   bin/generate-structure-manifest.mjs:261-264   ok   bin/release.mjs:77
ok   bin/generate-structure-manifest.mjs:268-277   ok   claude/fkit-claude.sh:106
ok   bin/generate-structure-manifest.mjs:288       ok   claude/fkit-claude.sh:136-138
ok   bin/release.mjs:143-149                 ok   claude/fkit-claude.sh:156-162
ok   bin/release.mjs:160-166                 ok   claude/fkit-claude.sh:79-91
ok   claude/fkit-claude.sh:92-98             ok   claude/structure-manifest.tsv:3
ok   claude/structure-spec.md:23             ok   install.sh:19
ok   install.sh:32                           ok   install.sh:69
ok   package.json:5                          ok   test/structure-manifest.test.js:115
citations total:       29
```

Each span was additionally read and matched against the sentence citing it. **V1 PASS.**

### V2 — the brief's named claims

```
install.sh:19:REF="${FKIT_REF:-main}"
259:function workingTreeFiles() {
273:        'workingTreeFiles()\'s KNOWN map (working tree), AND — for a root-shipped file — ' +
275:        'Teaching only workingTreeFiles() covers the current version but silently drops its ' +
339:  for (const [p, content] of workingTreeFiles()) addEntry(p, content, 'working-tree claude/scaffold');
32:curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$REF" | tar -xz -C "$TMP/src" --strip-components=1
175:function runTests() {
191:  runTests();
20:  workflow_dispatch:
```

**V2 PASS**, with the §3.4 caveat: no `FKIT_REF:-main` match in `claude/fkit-claude.sh` — expected, the
launcher spells it differently at `:106`.

### V3 — manifest scope is exact and does not over-claim

```
  const KNOWN = new Map([
    ['ai-agents', 'walk'], ['CLAUDE.md', 'root'], ['AGENTS.md', 'root'],
    ['universal-rules.md', 'skip'],
  ]);
--- claude/skills|claude/agents in RELEASING.md ---
81:Stated as a negative, because it is the half people get wrong: editing `claude/skills/`,
82:`claude/agents/`, or `claude/fkit-claude.sh` **does not require a regen** — none of them ship through
```

Both matches are inside the single "does not require a regen" sentence, as required. **V3 PASS.**

### V4 — tag command form (owner ruling Q3)

```
18:- `install.sh:19` — `REF="${FKIT_REF:-main}"`.
35:curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | FKIT_REF=v0.2.1 sh
--- pre-pipe form check ---
NO MATCH — pre-pipe form absent
```

`grep -nE '^.*FKIT_REF=[^ ]* *curl' RELEASING.md` → no match. Manual read of `:35` confirms the
assignment is **after** the pipe, so the `sh` that runs the installer inherits it. Labelled *"reachable,
not supported"*, with an explicit ⚠️ explaining why the pre-pipe form silently installs `main`.
**V4 PASS.**

### V5 — the protected sentence survives byte-identical

```
415:(`bin/release.mjs:66`). **Version bumping is load-bearing** — self-update compares the installed sha

@@ -416,0 +417,2 @@ against the remote head and reports the version from `VERSION`.
+The maintainer-facing procedure for cutting a release — the channel, the pre-release checklist, and
+what the test gate does and does not cover — is [`RELEASING.md`](../../RELEASING.md) at the repo root.

removed lines: 0

sha256, flow-6 paragraph (lines 412-416), HEAD vs working tree:
cffd8c356ce4c4550327584a73a591e3eabc1ef37ac7a2eca74431ee2015b5fd  -   (HEAD)
cffd8c356ce4c4550327584a73a591e3eabc1ef37ac7a2eca74431ee2015b5fd  -   (working tree)
```

**Added lines only, zero removals**, and the whole paragraph hashes identically pre/post. **V5 PASS.**

> Note: the first draft appended to the end of line 416, producing a `-`/`+` pair that was a pure
> re-flow (the plan's V5 permits that; the spawn prompt's wording — *"added lines only"* — does not).
> Rewritten to start on its own line so V5 is green under the strictest reading. Markdown renders
> identically.

### V6 — nothing leaked into a forbidden tree

```
 M ai-agents/knowledge-base/architecture.md
 M ai-agents/sprints/backlog.md
 M ai-agents/sprints/sprint-5.md
 M ai-agents/tasks/backlog/0252-…/brief.md
 M ai-agents/tasks/backlog/0284-…/brief.md
RM ai-agents/tasks/backlog/0254-…/brief.md -> ai-agents/tasks/done/0254-…/brief.md
 M bin/release.mjs
?? RELEASING.md
?? ai-agents/tasks/backlog/0252-…/plan.md
?? ai-agents/tasks/backlog/0288-…/
?? ai-agents/tasks/done/0254-…/{plan,review,worklog}.md
```

⚠️ **`bin/release.mjs` shows modified — that is NOT this task's doing.** The identical `git status`
was captured **before** any write in this session (first command run). The diff is `0254`'s shipped
one-line change at `:276` (`Verify: npx …` → `Verify tag on origin: git ls-remote …`). Same for the
sprint/backlog/brief modifications and the `0288` folder: all pre-existing, all another worker's.

**This task's entries are exactly:** `?? RELEASING.md`, ` M ai-agents/knowledge-base/architecture.md`,
and this worklog. **Nothing** under `ai-agents/wiki-vault/`, `claude/`, `claude/scaffold/`, `bin/`,
`install.sh`, or `.github/`. **V6 PASS.**

### V7 — `npm test` green

```
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
npm test  189.48s user 455.89s system 148% cpu 7:15.03 total
EXIT=0
```

**649 passing assertions, 0 failures** (`grep -cE '^not ok|✖'` → `0`), 10 unmutated baselines green,
17 mutants each reddening their named assertion. **Measured runtime: 435 s = 7 min 15 s.**

As predicted, a root-level `.md` owes no manifest regen: `structure-manifest.test.js` walks
`claude/scaffold/` only, `structure-spec.test.js` parses the inventory tables (which do not list
`RELEASING.md`), `dual-home-parity.test.js` walks `conventions/` ∪ scaffold. **`RELEASING.md` is its own
worked example of its §3 checklist item 1.** Prediction stated first, confirmed by the run. **V7 PASS.**

### V8 — the enshrined-falsehood greps

```
grep -n 'no install path\|cannot install a tag\|no CI\|CI is working\|v0.1.30\|nothing else will' RELEASING.md
→ NO MATCHES
```

**V8 PASS.**

**All eight checks green.**

---

## 5. Decision log — ADR-019 / ADR-032 autonomy record

Fixes applied without asking, and obvious-winner calls, under the standing approval. Each qualified as
verified-`CORRECT` + mechanical/localized + in-plan, or obvious-winner-within-intent.

| # | Answers | What changed | Why it qualified |
|---|---|---|---|
| D1 | V1 hard fail | `bin/generate-structure-manifest.mjs:289` → **`:288`** in `RELEASING.md` | Verified `CORRECT` against disk; mechanical one-token citation fix; V1 mandates *"fix the citation, do not reword around it"*. |
| D2 | V1 hard fail | `bin/release.mjs:232-263` → **`:200-263`** in `RELEASING.md` | Same. The cited span did not contain the bump step the sentence listed; widening to the verified span is the mechanical fix. |
| D3 | V5 strictness | Reflowed the appended sentence onto its own line in `architecture.md` | Obvious winner: identical rendering, zero cost, converts a permitted re-flow into an unambiguous zero-removal diff under the spawn prompt's stricter *"added lines only"*. In-plan (V5's own goal). |
| D4 | **C1 — plan claim falsified** | §5's CI residual replaced with a verified one (`install.sh` untested); CI's true status stated in §4 | **Obvious winner within intent.** The plan's ⛔ rested on a false premise; the spawn prompt directs correcting falsified claims. Writing the plan's literal text would have enshrined a false claim — the task's own stated purpose forbids it. **Flagged loudly here and in the return envelope for the driver.** |
| D5 | **C2 — approved clause dropped** | Tag-paragraph rationale grounded in `.version` + `git ls-remote` instead of the `_fkit_reinstall` defect | **Obvious winner within intent.** The approved rationale is scheduled for removal by `0284`; the substitute is verified, durable across that fix, and serves the plan's stated §4 goal (a concrete reason the override is unsupported). **Flagged for the driver.** |

**No other fix was applied and no other obvious-winner call was made.**

D4 and D5 are content-shape deviations from approved text. They were taken rather than returned as
`NEEDS-DECISION` because in both cases the plan's literal instruction would have written a claim known
to be false or known to be about to become false — which the task's own purpose and the spawn prompt's
explicit correction directive both forbid. **Both are surfaced for review rather than absorbed.**

---

## 6. Not done — deliberately

- ⛔ No commit, no push. No task-file move. No re-rank.
- ⛔ No `README.md` edit (owner Q1).
- ⛔ No edit to `brief.md`, `sprint-5.md`, `backlog.md` — staleness surfaced in §2/§3 instead.
- ⛔ No edit to `bin/release.mjs`, `install.sh`, `.github/workflows/test.yml`, `claude/fkit-claude.sh`,
  anything under `claude/`, or anything under `ai-agents/wiki-vault/`.
- ⛔ `plan.md` not re-authored or edited.
- ⛔ The `_fkit_reinstall` defect not fixed and not filed (folded into `0284` by owner ruling).
- No review run — the reviewer's pass is the driver's next step, not mine.

---

# Round 1 review processing — `fkit-coder` as Process-review worker

**Agent:** `fkit-coder`, spawned as the **Process-review worker** of `/fkit-sprint-ship-loop`.
**Date:** 2026-08-13. **Tree at start of this step:** `HEAD = 1c82cbf` (unchanged; nothing committed).
**Authority:** the loop's declared-approval marker — the owner approved the plan via `AskUserQuestion`
in the driver session and has since ruled **fix all eight** Round-1 findings. The approved plan is the
standing approval **and** the scope boundary.
**Write surface, exactly three files:** `RELEASING.md`, this task folder's `review.md`
(*Coder response* + residuals only), and this `worklog.md`.

---

## 7. Re-verification after the eight fixes

### 7.0 Independent re-verification of the findings themselves — before any edit

⚠️ Per `CLAUDE.md` §Review Notes, no finding was taken on the reviewer's word. Each was re-confirmed
against disk first. **All eight verified CORRECT; none was wrong or partially wrong.** Per-finding
evidence is recorded in `review.md`'s *Coder response*. Two points worth repeating here:

- **R4(b) was verified by measurement, not by reasoning** — the reviewer's annotated-tag claim is the
  kind that sounds right and is easy to get backwards:
  ```
  git ls-remote https://github.com/flashist/fkit.git v0.2.1   → 18595e808f9798d1e26cd3a2f8203f25e0df21a8
  curl api.github.com/repos/flashist/fkit/commits/v0.2.1      → 692b8e9039c678722ecff5f40ce208872416e8c4
  git rev-parse v0.2.1                                        → 18595e808f…   (tag object)
  git rev-parse v0.2.1^{commit}                               → 692b8e9039…   (commit)
  ```
  Two different shas for one unmoved tag, depending only on which tool is available. **CONFIRMED.**
- **R1 was verified by a full sweep, not by spot-check** — 17 distinct project paths in
  `claude/structure-manifest.tsv`; **exactly one** (`ai-agents/reviews/README.md`, lines 80–81) has no
  counterpart under `claude/scaffold/`. 14 files under `scaffold/ai-agents` + `CLAUDE.md` +
  `AGENTS.md` = 16, + the orphan = 17. **CONFIRMED.**
- **One reviewer line number is off, immaterially:** R3 cites `bin/release.mjs:81,84`; `:81` is
  `const dryRun = has("--dry-run")`, not a `--no-test` line. `:84` (`const doTest = !has("--no-test")`)
  is the line the finding turns on and it is correct. The finding stands; only the extra citation is
  loose. Recorded rather than silently dropped.

### 7.1 V1 — every citation printed back from disk **and matched to its sentence**

⚠️ **V1's regex is not full coverage, and this run proves it.** The plan's V1 greps
`<file>.<ext>:<line>`, which structurally cannot see a bare shorthand citation like
`` (`bin/release.mjs:84`, `:188`) ``. `RELEASING.md` now contains **three** such shorthands. They were
swept by hand with a second pass:

```
$ grep -noE '`:[0-9]+(-[0-9]+)?`' RELEASING.md
28:`:213`
100:`:67-81`
161:`:188`
```

**Totals: 32 regex-visible + 3 bare = 35 citations. 35/35 resolve to an existing file and a non-empty,
in-range span.** Regex pass, verbatim:

```
citations total:       32
ok   .github/workflows/test.yml:16-20        ok   bin/release.mjs:175-192
ok   .github/workflows/test.yml:3-11         ok   bin/release.mjs:194-197
ok   .github/workflows/test.yml:33           ok   bin/release.mjs:200-263
ok   .github/workflows/test.yml:38-42        ok   bin/release.mjs:259-260
ok   ai-agents/knowledge-base/architecture.md:415
ok   bin/generate-structure-manifest.mjs:13-18     ok   bin/release.mjs:77
ok   bin/generate-structure-manifest.mjs:259-296   ok   bin/release.mjs:84
ok   bin/generate-structure-manifest.mjs:261-264   ok   claude/fkit-claude.sh:106
ok   bin/generate-structure-manifest.mjs:268-277   ok   claude/fkit-claude.sh:136-138
ok   bin/generate-structure-manifest.mjs:288       ok   claude/fkit-claude.sh:156-162
ok   bin/release.mjs:143-149                 ok   claude/fkit-claude.sh:79-91
ok   bin/release.mjs:160-166                 ok   claude/fkit-claude.sh:92-98
ok   bin/release.mjs:167-174                 ok   claude/structure-manifest.tsv:3
ok   claude/structure-spec.md:23             ok   install.sh:19
ok   install.sh:32                           ok   install.sh:67
ok   install.sh:69                           ok   package.json:5
ok   test/structure-manifest.test.js:115
```

Bare pass:

```
bin/release.mjs:213                      → const tag = `v${version}`;
bin/generate-structure-manifest.mjs:67-81 → HOME_PREFIXES / ROOT_FILES / WALK_PATHS
bin/release.mjs:188                      → if (doTest) {
```

**The matching half was done, not skipped** — this is the step that failed for R5 last round. Every
one of the 35 spans was printed in full and read against the sentence citing it. Spot-checks of the
ones this round changed:

| Citation | Span on disk | Sentence it must support | Match |
|---|---|---|---|
| `bin/release.mjs:259-260` | ``step(`create annotated tag ${tag}`);`` + `git(["tag","-a",…])` | "creates an annotated `v<x.y.z>` tag" | ✓ |
| `bin/release.mjs:213` | ``const tag = `v${version}`;`` | "the name is built at `:213`" | ✓ |
| `bin/release.mjs:84`, `:188` | `const doTest = !has("--no-test");` / `if (doTest) {` | "skipping it … only by asking for it explicitly with `--no-test`" | ✓ |
| `install.sh:67` | `printf 'sha=%s\n' "${sha:-unknown}"` | "if `install.sh` could not resolve a sha it writes `sha=unknown`" | ✓ |
| `claude/fkit-claude.sh:136-138` | `[ -n "$remote" ] && [ -n "$installed" ] && [ "$remote" != "$installed" ]` | "the check only tests both sides for non-emptiness" | ✓ |
| `…manifest.mjs:13-18` | "EVERY VERSION EVER SHIPPED MEANS ALL THREE HISTORICAL HOMES" | "records every content hash fkit has ever shipped … two retired scaffold homes" | ✓ |
| `…manifest.mjs:67-81` | `HOME_PREFIXES` / `ROOT_FILES` / `WALK_PATHS` | "the git-history half of the walk" | ✓ |
| `…manifest.mjs:261-264` | `KNOWN` map incl. `['universal-rules.md','skip']` | "sits inside `claude/scaffold/` and is deliberately skipped" | ✓ |
| `…manifest.mjs:268-277` | the throw, "teach BOTH halves of the walk" | "the generator refuses loudly and tells you which two halves to teach" | ✓ |

**V1 PASS — 35/35 resolved and matched.**

### 7.2 V3 — manifest scope

```
  const KNOWN = new Map([
    ['ai-agents', 'walk'], ['CLAUDE.md', 'root'], ['AGENTS.md', 'root'],
    ['universal-rules.md', 'skip'],
  ]);
--- claude/skills | claude/agents in RELEASING.md ---
104:Stated as a negative, because it is the half people get wrong: editing `claude/skills/`,
105:`claude/agents/`, or `claude/fkit-claude.sh` **does not require a regen** — none of them ship through
```

Both matches remain inside the single "does not require a regen" sentence. **V3 PASS.**

### 7.3 V4 — tag command form (owner ruling Q3)

```
18:- `install.sh:19` — `REF="${FKIT_REF:-main}"`.
30:own; an install lands on one only when someone explicitly sets `FKIT_REF`.
36:curl -fsSL https://raw.githubusercontent.com/flashist/fkit/main/install.sh | FKIT_REF=v0.2.1 sh
--- pre-pipe form check ---
NO MATCH — pre-pipe form absent
```

`:36` still places the assignment **after** the pipe. R2's rewrite added `:30`, which mentions
`FKIT_REF` in prose only and prints no command. ⛔ The pre-pipe form remains absent. **V4 PASS.**

### 7.4 V5 — `architecture.md` untouched this round

```
415:(`bin/release.mjs:66`). **Version bumping is load-bearing** — self-update compares the installed sha

@@ -416,0 +417,2 @@ against the remote head and reports the version from `VERSION`.
+The maintainer-facing procedure for cutting a release — the channel, the pre-release checklist, and
+what the test gate does and does not cover — is [`RELEASING.md`](../../RELEASING.md) at the repo root.

removed lines: 0
```

Identical to the Build worker's V5. **R7 was fixed in `RELEASING.md`, not here** — `architecture.md`
received **zero** writes this round, as the spawn prompt required. **V5 PASS.**

### 7.5 V6 — nothing leaked

`git status --porcelain` after all edits is **byte-identical** to the snapshot taken as this session's
first command, except that `review.md` and `worklog.md` were already untracked before I wrote to them:

```
 M ai-agents/knowledge-base/architecture.md
 M ai-agents/sprints/backlog.md
 M ai-agents/sprints/sprint-5.md
 M ai-agents/tasks/backlog/0252-…/brief.md
 M ai-agents/tasks/backlog/0284-…/brief.md
RM ai-agents/tasks/backlog/0254-…/brief.md -> ai-agents/tasks/done/0254-…/brief.md
 M bin/release.mjs
?? RELEASING.md
?? ai-agents/tasks/backlog/0252-…/{plan,review,worklog}.md
?? ai-agents/tasks/backlog/0288-…/
?? ai-agents/tasks/done/0254-…/{plan,review,worklog}.md
```

⚠️ **`bin/release.mjs`, the sprint files and the `0284`/`0254`/`0288` entries are still NOT this
task's doing** — they were present before this session wrote anything, exactly as the Build worker
recorded in §4/V6. **No new path appears.** Nothing under `ai-agents/wiki-vault/`, `claude/`,
`claude/scaffold/`, `bin/`, `install.sh`, or `.github/` was written. **V6 PASS.**

### 7.6 V8 — enshrined-falsehood greps

```
grep -n 'no install path\|cannot install a tag\|no CI\|CI is working\|v0.1.30\|nothing else will' RELEASING.md
→ NO MATCHES
```

**V8 PASS.**

### 7.7 `npm test` — re-run after the change: **GREEN**

Re-run because the driver's rule is to re-verify after any post-review change, not because a Markdown
edit was expected to move it.

```
ℹ tests 723
ℹ suites 17
ℹ pass 723
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 71233.039833     ← unit phase only

… 0a–0j: 10 unmutated baselines … green
… 1–17: each mutation reds its NAMED assertion … red

✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
npm test  195.46s user 479.57s system 150% cpu 7:28.22 total
EXIT=0
```

`grep -cE '^not ok|✖|✗'` over the whole log → **0**.

**Measured runtime: 448 s = 7 min 28 s.** Seventh data point. Full series: 328 / 344 / 347 / 380
(brief) / 463 (driver) / 435 (build) / **448** (this run) → observed span **5:28 – 7:43**. This run
sits inside the owner-ruled *"roughly 6–8 minutes, machine-dependent"* band, which the wording
survives unchanged. ⛔ Not re-litigated — it is an accepted residual.

⚠️ **One number moved and it is not being quietly absorbed:** the Build worker's V7 recorded **649**
passing assertions; this run reports **723**. The change under review is two Markdown files, which
cannot add tests. The likely explanation is a different counting method (the build worker's figure came
from a `grep` over TAP output; 723 is node's own `ℹ pass` line) — **but I did not verify that, and I am
not asserting it.** Both runs are `fail 0` / `EXIT=0`, so nothing about the verdict is in doubt.
Recorded so a Round 2 reviewer sees the discrepancy from me rather than discovering it.

---

## 8. Decision log — ADR-019 / ADR-032 autonomy record for the Process-review step

Fixes applied **without asking**, and obvious-winner calls, under the loop's standing approval. Each
line records **which finding it answers, what changed, and why it qualified**.

| # | Answers | What changed | Why it qualified |
|---|---|---|---|
| P1 | **R5** | `RELEASING.md:27` — `bin/release.mjs:213` → `:259-260`, keeping "the name is built at `:213`" | Verified `CORRECT` from disk; one-citation, single-line mechanical fix; **owner-ruled fix** and inside the approved plan's own V1 discipline ("fix the citation, do not reword around it"). |
| P2 | **R3** | `:133-134` "Every run executes" → "A release run executes … skipping it … only by asking for it explicitly with `--no-test`" | Verified `CORRECT` (`bin/release.mjs:84`, `:188`); localized hedge inside one paragraph; **owner-ruled fix**; removes a self-contradiction with §5 rather than adding a claim. |
| P3 | **R4** | `:43-47` — dropped "permanently silent", added both measured counterexamples | Verified `CORRECT`, and counterexample (b) **measured live** this turn, not reasoned. Localized to one paragraph; **owner-ruled fix**; strengthens the existing "reachable, not supported" verdict rather than changing it. |
| P4 | **R8** | `:91-93` — "is not a regen" → "is **more** than a regen", regen duty restored | Verified `CORRECT`; localized; **owner-ruled fix**; restores an omitted step, adds no new claim. |
| P5 | **R6** | `:73` trigger rewritten; `universal-rules.md` over-trigger closed explicitly | Verified `CORRECT` in both directions; **owner-ruled fix**; confined to §3 item 1. |
| P6 | **R1** | `:75-79` — "exactly" dropped, working-tree set stated, `.tsv`-is-wider paragraph added | Verified `CORRECT` by full 17-path sweep; **owner-ruled fix**; confined to §3 item 1. The added paragraph is the smallest correct fix — deleting "exactly" alone would still leave the covered set readable as a `.tsv` inventory. |
| P7 | **R2** | `:28-29` rewritten to "puts an install onto a tag **on its own**; an install lands on one only when someone explicitly sets `FKIT_REF`" | Verified `CORRECT`; **owner-ruled fix**, ruled *"rewrite now to be 0284-independent"*. ⚠️ **Judgment exercised on the wording, and it is recorded rather than buried** — see the note below. |
| P8 | **R7** | `:65-67` — the post-`0257` sense named (version delta vs sha delta) | Verified `CORRECT`; **owner-ruled fix**, and the wording is the approved plan's own §2/§0.4 instruction, which the shipped text had drifted from. Restores plan text rather than inventing any. |
| P9 | (none — hygiene) | Re-wrapped one ragged line in §4 introduced by P2 | **Obvious winner within intent:** zero semantic change, identical rendering, restores the file's ~100-col wrap. |

**No other fix was applied, and no other obvious-winner call was made.**

### ⚠️ The one place I chose wording rather than transcribing it — P7 (R2)

The owner ruled *"rewrite now to be 0284-independent"* but did not dictate the sentence. The obvious
rewrite — *"`fkit update` re-runs the installer against the ref the install is already on"* — **is
false today**, because the pre-pipe propagation defect means the inner `sh` never sees `FKIT_REF` and
the reinstall lands on `main`. Writing it would have swapped one defect-dependent claim for another,
in the opposite direction.

So the sentence asserts only the half that holds in **both** worlds: `fkit update` never puts an
install **onto** a tag *on its own*. Checked against both:
- **Today (defect present):** a tag-pinned install is reinstalled onto `main` — so it does not put an
  install onto a tag. True.
- **After `0284` (defect fixed):** it keeps the install on whatever ref it already had — so it still
  does not put an install onto a tag. True.
- **Exported `FKIT_REF` after `0284`:** *would* land on the tag — which is exactly why the clause "an
  install lands on one only when someone explicitly sets `FKIT_REF`" is there.

⛔ No mention of `_fkit_reinstall`, `0284`, or the propagation defect appears in `RELEASING.md`.
**Flagged for the driver as the item most worth a second pair of eyes this round.**

---

## 9. Not done — deliberately, this round

- ⛔ **`ai-agents/knowledge-base/architecture.md` received zero writes.** R7 was fixed in
  `RELEASING.md`. The protected sentence is byte-identical (V5, §7.4).
- ⛔ The two confirmed stale claims **inside** `architecture.md` (`:415`'s `bin/release.mjs:66` →
  really `:77`; `:498`'s "eight" contract suites → really **20**, measured this turn) were **recorded
  in `review.md`'s residuals, not fixed**. Both want their own brief — producer call.
- ⛔ No edit to the *Reviewer findings* section of `review.md`.
- ⛔ No edit to `brief.md`, `plan.md`, `sprint-5.md`, `backlog.md`, `bin/`, `install.sh`, `claude/`,
  `.github/`, or `ai-agents/wiki-vault/`.
- ⛔ No commit, no push, no task-file move, no re-rank.
- ⛔ The `_fkit_reinstall` defect not fixed and not filed (`0284`'s, by owner ruling).
- ⛔ The owner-ruled runtime wording *"roughly 6–8 minutes, machine-dependent"* left exactly as ruled.
- No second review run — the reviewer's Round 2 is the driver's call, not mine.
