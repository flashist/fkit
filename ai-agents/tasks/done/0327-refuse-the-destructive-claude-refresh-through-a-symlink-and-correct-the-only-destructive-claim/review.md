# Review — 0327

Task: `ai-agents/tasks/done/0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim/brief.md`
File(s) under review: working tree vs `HEAD` (`c45ec3d`) — `claude/fkit-claude-init.sh`, `claude/orphan-targets`,
`test/init-claude-refresh-guard.test.js` (new), `test/orphan-cleanup.test.js`, `test/init-intake-guard.test.js`
Status: closed-out

---

## Reviewer findings

**Round 1 — reviewers run:** fkit-reviewer's own pass (read + **executed reproductions**, every one in
`mktemp -d` dirs outside the repo) **and** the Codex adversarial pass (`codex exec --sandbox read-only`,
`gpt-5.6-sol`, completed, full coverage — reasoning-and-read-only per ADR-042 D1, the normal expected
state, not a degradation). **No reviewer was skipped.**

**Coverage note carried into the verdict:** Codex explicitly *cleared* the area that R1 lives in, on the
reasoning that macOS `rm` uses `FTS_PHYSICAL` and would not traverse a `fkit-*/` directory symlink. **That
clearance is disproven by measurement** (see R1) — the glob's **trailing slash** forces symlink resolution
before `rm` ever walks. Recorded because an automated reviewer's "no finding" is an input, not an authority.

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | high   | `claude/fkit-claude-init.sh:579-581` | **The defect this task exists to close is still live one level below the new guard.** `path_contained ".claude/skills" refresh` walks `.claude` and `skills` but **not the `fkit-*` entries the `rm -rf` actually names.** The loop's glob `"$dest/.claude/skills/fkit-"*/` yields a **trailing slash**, which forces symlink resolution, so `rm -rf ".../fkit-x/"` deletes the **link target's whole tree outside the project** and leaves the link dangling. **Measured, post-fix:** `.claude/skills/fkit-evil -> /tmp/…/precious` → `precious/` and its contents **deleted**, `rc=0`, **empty stderr**, and stdout announced `• refreshed 7 agents → .claude/agents/, 26 skills → .claude/skills/`. Same class, same blast radius, same silence as the shape the brief reproduced. The brief names this loop specifically: *"⛔ The `rm -rf` loop is the one that must not be missed — it is the recursive one."* **Pre-existing, not a regression** — but the deliverable is only partially met. |
| R2 | 1     | medium | `claude/fkit-claude-init.sh:579,582` | **A dangling or non-directory `.claude/skills/fkit-<name>` symlink kills init under `set -euo pipefail`** — the exact failure mode the guard-before-`mkdir` placement was designed to end, surviving one level below the guard. The `fkit-*/` glob skips a dangling entry (`[ -d ]` false), so `cp -R` hits it: **measured** `cp: …/.claude/skills/fkit-heal: Not a directory`, **`rc=1`**, a bare `cp` error with **no fkit refusal message**, and **§5 (`.gitignore`) and §6 (orphan cleanup) never ran**. With a **payload-name** collision the two compound: `.claude/skills/fkit-heal -> /tmp/…/mydata` → the outside dir is **deleted by R1's `rm -rf`** *and then* init dies at the `cp`, leaving setup half-applied. Distinct from `0328`, which owns the two `mkdir -p` calls — this is `cp -R`. Raised by Codex as "suspected, needs a run"; **I ran it: CORRECT.** |
| R3 | 1     | medium | `claude/fkit-claude-init.sh:691-702` (also `:17-18`, `:527-528`, `claude/orphan-targets:9-11`, `test/orphan-cleanup.test.js:1-2`) | **The corrected exclusivity claim is still false**, and this task's second deliverable is *"the claim must stop being false."* *"fkit's ONLY UNRECOVERABLE DELETE — the only place it removes a path it did not write and does not put back"* and *"step 3's refresh … re-creates what it removed"* are both untrue in two shapes the code exhibits **today**: **(a)** R1 — §3's `rm -rf` removes an outside tree fkit never wrote and never puts back; **(b)** the `fkit-` prefix shape the worklog itself records — `fkit-mine.md` / `fkit-myskill/` are deleted and **not** re-created, so `:527-528`'s *"a user's own agents/skills in `.claude/` are never touched"* is left verbatim false and the **new** claims now rest on it. The plan decided to record (b) in the worklog; the **comment** is what the next reader consults, and this task exists precisely because a false comment pointed the previous reader at the wrong section. Raised by **both** reviewers (Codex: high). |
| R4 | 1     | low    | `claude/fkit-claude-init.sh:530`, `claude/fkit-claude-init.sh:600` | **A durable-citation anchor was broken by this diff, and a new one was written already-stale.** The header edit added exactly **+2 lines above line 315**, moving §1's doctrine line (*"`[ -L ]` is the one test that does not lie…"*) from `:315` to **`:317`**. §4's pre-existing citation at `:600` (correct at `HEAD`) is now wrong, and §3's **new** citation at `:530` was written wrong. Both pair the number with a durable gloss (*"the doctrine §1 states at :315"*), which is why this is low — but `ai-agents/knowledge-base/conventions/durable-citation-anchors.md` is a live convention and `0176` is building a guard for exactly this class. |
| R5 | 1     | low    | `test/init-claude-refresh-guard.test.js:234-267` | **The suite pins the guarded leaf and above, but nothing below it, and C1's control side-steps the namespace the new comments assert.** No case covers a symlink *below* `.claude/skills` (R1) or a dangling entry (R2); C1 deliberately uses non-`fkit-` names (`my-agent.md`, `my-skill/`), so **no test pins what R3's new "recoverable refresh" claim actually rests on** — that a `fkit-`named user path is deleted and not restored. The suite therefore stays green while the production comment is false. Raised independently by Codex (medium). |

**Disproven / not raised as rows** (recorded so nobody chases them):

- Codex's clearance *"a live directory symlink matching `fkit-*/` is not traversed by macOS `rm`"* — **INCORRECT**, disproven by measurement; it is R1.
- **Not re-raised, verified settled or out of scope:** TOCTOU (inherited, not widened — §3's guard is the same shape as §4/§6); the exit-status-unchanged ruling **Q1(a)** and its owner-accepted consequence (a fresh project with a symlinked `.claude` fails at session start with Claude Code's own *"agent not found"* — **confirmed on the code**: `claude/fkit-claude.sh:387`'s fail-safe is gated on `setup_ok = 0`, and init still exits 0, so the launcher proceeds and Claude Code emits its own message; **no shell crash** — `build_settings()` does not enumerate `.claude/skills`); `0328` (the two `mkdir -p` calls), `0329`, `0330`, `0332`, `0037`, `0045`.
- **Confirmed recorded, not re-litigated:** the launcher's fail-safe `ls "$proj"/.claude/agents/fkit-*.md` **dereferences**, so a project that ran the buggy init once finds the escaped copies and starts a session reading agents from outside the project. Recorded in this task's `plan.md` §6 Q1 and `worklog.md`. It has **no owning task** — `0330` covers the launcher's `.fkit` *writes*, not this read.

**Build claims re-derived independently this round:**

| Build claim | Re-derived? |
|---|---|
| `npm run test:unit` → 744/744, fail 0 (737 + 7) | ✅ re-ran: `tests 744 / pass 744 / fail 0 / suites 23` |
| §4.5 regressions → 112/112 | ✅ re-ran the five named suites: `tests 112 / pass 112 / fail 0` |
| §4.3 reference gate clean | ✅ re-ran the gate's own grep for all four target tokens over `claude/` excluding `orphan-targets` — **zero hits**; `node --test test/orphan-cleanup.test.js` green |
| `claude/orphan-targets` parser skips the comment edit | ✅ every added line is `#`-prefixed; the parser trims leading whitespace **before** the `#` test; the "target list" assertions still green |
| Red-first premise (pre-fix destroys) | ✅ **independently reproduced** against `git archive HEAD`: `.claude -> outside` → `agents/fkit-mine.md` and `skills/fkit-myskill/SKILL.md` **both deleted**, `rc=0`, **empty stderr**, stdout announced a successful refresh |
| Post-fix A1 refuses | ✅ **independently reproduced**: both halves refused on **stderr**, outside tree byte-identical, **no** summary line |
| `set -u` summary truthful in all four combinations | ✅ verified by reading `:553-593` and by running the both-halves and neither-half shapes; A2/A3 pin the one-half shapes |
| Guards precede every `mkdir -p` | ✅ verified at `:555`/`:564` and `:569`/`:578` |
| `claude/fkit-claude.sh` untouched (Q1a) | ✅ `git status` — unmodified |
| Containment (`mkdtemp` under `os.tmpdir()`, cleaned in `after()`) | ✅ verified by reading the suite; repo `git status --porcelain` unchanged by every run I made |
| `prove-red.sh` → 22/22, hard gate PASSED, new suite false-reds no mutant | ✅ re-ran: all **22/22** mutations red at their **named** assertion; `✓ hard gate PASSED — real + unmutated copy green`; no mutant run was false-reded by the new suite |
| C1 passed **pre-fix** as well as post-fix | ❌ **NOT re-derived.** `test/harness.mjs:160` hardcodes `INIT` with no env override, so the suite cannot be pointed at a pre-fix copy without editing source, which this role may not do. Taken on the build's report. |

**Known evidence gap — confirmed, not re-derived as new:** `prove-red.sh` cannot reach
`fkit-claude-init.sh` (`test/harness.mjs:160` hardcodes `INIT`, no env override), so the red-first proof
for this change is **manual, not mechanized**. That seam is open task `0037`'s deliverable and was
deliberately not built here. The build stated this plainly.

**Self-flagged item — the A2/A3 stdout-vs-stderr slip — judged: the resolution is correct, and no
behaviour was bent to suit a test.** The plan's §3 Step 2 implementation block routes the warning `} >&2`
and its A1 row says stderr; the Step 1 table's "stdout" wording is a slip against the plan's own design.
The stderr routing is not a new choice — it is §1's documented precedent, for the stated reason that the
launcher sends init's stdout to `/dev/null` on an already-set-up project (`claude/fkit-claude-init.sh:322-325`,
`:548-549`). The build asserted the **union** of both readings (refusal on stderr, the other half's refusal
**absent** from stderr, and the stdout summary reflecting only the half that ran), which is strictly
stronger than either and cannot be satisfied by a weaker implementation. Correctly logged as an
obvious-winner call.

---

**Round 2 — reviewers run:** fkit-reviewer's own pass (read + **executed reproductions**, 17 shapes, every
one in `mktemp -d` dirs outside the repo) **and** the Codex adversarial pass
(`codex exec --sandbox read-only --cd "$PWD"`, `gpt-5.6-sol`, **completed, full coverage** — reasoning-and-
read-only per ADR-042 D1, the normal expected state, not a degradation event). **No reviewer was skipped.**

⚠️ **Codex did NOT repeat round 1's wrong clearance.** Given the fix to attack and the round-1 history, it
independently **confirmed** the guard/destroyer enumeration (`fkit-*/` ⊂ `fkit-*`), the nested-symlink
negative, and the agents-half negative. **Every one of those was also confirmed by my own measurement** —
the clearances are recorded as corroborated, not taken on its word.

**Round-1 findings — closure state, each re-derived by measurement or by reading the code:**

| # | R1-round sev | Closed? | How I verified |
|---|---|---|---|
| R1 | high | ✅ **CLOSED** | 8 executed shapes — live dir symlink at a non-payload name, at a **payload** name, symlink→**file**, **dangling**, basename with **space + glob metachar**, **relative escaping** (`../../../`), symlinked `.claude/skills`, symlinked and **dangling `.claude`**. In every one: outside tree **byte-intact**, `rc=0`, refusal on **stderr naming the offending entry**, **no** skills summary line, agents half unaffected, `.gitignore` still created. The guard's enumerated set is a **superset** of the `rm -rf` loop's (`fkit-*` sees dangling links, file links and files that `fkit-*/` cannot); the literal-glob no-match case fails `[ -L ]` and is skipped safely. |
| R2 | medium | ✅ **CLOSED as worded** (symlink shapes) | Dangling and symlink→file at a **payload** name both refuse non-fatally: `rc=0`, **no `cp:` in stderr**, §5 and §6 both run. ⚠️ The **non-symlink** subset of "non-directory" is not covered — see **R6**, which is **pre-existing at `HEAD`**, not a regression, and out of this task's scope. |
| R3 | medium | ✅ **CLOSED** | All **six** sites verified rewritten (`fkit-claude-init.sh:19`, `:531`, `:732`; `claude/orphan-targets:9`; `test/orphan-cleanup.test.js:1`; `test/init-intake-guard.test.js:4`). The sixth site was a real omission from my round-1 list. **The new claim is true as written**: every other delete in `claude/` removes a path fkit itself created — `fkit-claude-init.sh:457,502,507` (its own `mktemp` file), `claude/fkit-claude.sh:120` (`$share/.latest`, `$share/.update-check` in fkit's own install root), `claude/turn-completion-hook.sh:77` (`$cwd/.fkit/state/askuq-*`). One narrow shape narrows it — folded into **R6**, not re-raised as R3. |
| R4 | low | ✅ **CLOSED, and durably** | Both `:315` coordinates **deleted**, not renumbered, and replaced with the quoted fragment *"is the one test that does not lie, so it has to come first"* — **unique** as an anchor (`:282` uses a different wording). **Proof the repair was durable, not lucky:** round 2 shifted the doctrine line **again**, from `:317` to **`:319`**, and both repaired citations are still correct. A renumber-to-`:317` fix would already be stale. |
| R5 | low (Codex: medium) | ✅ **CLOSED as worded** — and **low** is the right call | **A6** asserts a **two-way `manifest()` freeze** of the outside tree, the user's link surviving, the refusal naming the entry, agents unaffected, and **no false summary line**. **A7** asserts `rc`, **no `cp:` in stderr**, `.gitignore` present, and setup completing. Both go **red** pre-fix. **D1** passes pre-fix **by design** — it is a *claim*-pin for R3's wording, not a fix-pin, and says so. I agree with the coder's **low** over Codex's medium: the gap was a missing pin on R1–R3, which are now fixed **and** pinned. |

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R6 | 2     | low  | `claude/fkit-claude-init.sh:601`, `:616-618`; the claim at `:531` | **A WRONG-TYPE (non-symlink) real entry squatting either `fkit-*` pattern still kills init under `set -euo pipefail`, and the agents half wipes the installed fkit agents before it dies.** The new guard tests `[ -L ]` only, so a **real directory** `.claude/agents/fkit-x.md` or a **real regular file** `.claude/skills/<payload-skill-name>` passes it. **Measured:** real dir in agents → `rm: …/fkit-x.md: is a directory`, **`rc=1`**, §5 and §6 never run; on an **already-installed** project `rm -f` removes the earlier `fkit-*.md` agents *before* failing, and `cp` never runs, so the project is left with **zero** fkit agents (the user's own `my-own.md` **survives**). Real file in skills → `cp: …: Not a directory`, **`rc=1`**, `.gitignore` never created. ⛔ **PRE-EXISTING, NOT A REGRESSION — verified byte-identical against `git archive HEAD`** (`rc=1`, same two messages). Nothing outside the project is touched and no user-owned path is destroyed; the only loss is fkit's own gitignored payload, restored by moving the stray and re-running, and `rc=1` routes to the launcher's own `setup_ok` fail-safe rather than a silent success — **which is why I assign low against Codex's medium**. It also narrows `:531`'s new wording: a **wrong-type** squatter is *not* "removed and NOT put back", it is **not removed at all** — init aborts on it. **Raised by both reviewers**; Codex found it by reading, I found it by measurement, independently. **Out of `0327`'s scope** — the deliverable is refusing the refresh through a **symlink**. |
| R7 | 2     | low  | `claude/fkit-claude-init.sh:578-585`, `:606-612` | **The skills refusal names only the FIRST symlinked entry, and its path line points at the wrong path.** `skills_entries_contained()` `return 1`s on the first `[ -L ]` hit, so with two offenders (**measured:** `fkit-aaa` + `fkit-zzz`) only `fkit-aaa` is named and the user discovers the rest **one re-run at a time**. The line under the headline prints `$dest/.claude/skills` — the **real parent**, not the symlink — directly above *"Replace the symlinked path with a real directory"*, so the sentence points at a directory that is not the problem. Nothing is destroyed and the whole half is correctly refused. **Raised by both reviewers.** ⚠️ **This is NOT the whole-half-refusal granularity question** (owner-ruled KEEP, recorded as an accepted residual below) — it is a gap against the fix's **own stated rationale**, `:574-575`: *"The message names the offending entry so the user knows which one to move."* With 2+ offenders it names one of them. |

**Considered and explicitly NOT raised as rows** (recorded so nobody re-derives them):

- **The em-dash gloss at `:732`** — *"the only place it removes a path named from a list, rather than one
  matched by one of its own two `fkit-*` patterns."* Literally, other named-path deletes exist (the three
  enumerated in R3's row above). **Not a defect:** every one removes a file **fkit itself created inside its
  own namespace**, so the load-bearing headline (*"the only place fkit deletes OUTSIDE the namespace it
  manages"*) holds, and the bullets immediately below scope it exactly — *"§6 names the USER's own paths,
  outside any pattern fkit owns. That is what the headline claims, and all it claims."* Checked, true, closed.
- **Stale citations pointing INTO this file from elsewhere** — `test/structure-manifest.test.js:27` cites
  `claude/fkit-claude-init.sh:374` and `:253` cites `:366-372` for `marker_lines`; `claude/skills/fkit-heal/check.sh:40`
  cites `:374`. `marker_lines()` is at **`:424`** in the working tree and was at **`:420` at `HEAD`**, and
  `HEAD:374` is the rules-block **budget** comment. ⛔ **Already wrong at `HEAD` — NOT broken by this diff**,
  so it is not R4's class. `0171`/`0176`'s class; flagged as an optional filing question, not a finding here.

**Build claims re-derived independently this round — every figure re-run, none carried:**

| Build claim | Re-derived? |
|---|---|
| `npm run test:unit` → **747/747**, fail 0 (744 + 3) | ✅ re-ran: `tests 747 / pass 747 / fail 0 / suites 24` |
| `bash test/prove-red.sh` → **22/22**, hard gate PASSED, no mutant false-red | ✅ re-ran: steps 0a–0k green, all **22/22** red at their **named** assertion, `✓ hard gate PASSED — real + unmutated copy green`; no mutant false-reded by the new tests |
| §4.3 reference gate **zero hits**, and the "naive grep hits `.omnigent` in four files" alarm is **false** | ✅ **confirmed false alarm, measured per token.** `.omnigent`: naive regex **4** hits / `-F` **0**; `.fkit/agents`, `.fkit/run`, `.fkit/team-session`: **0/0** each. The four naive hits are the leading `.` acting as a wildcard against the word *Omnigent* in `claude/README.md:10`, `claude/structure-spec.md:146`, `claude/skills/fkit-heal/repair.sh:175`, `claude/skills/fkit-heal/check.sh:57`. With `\.` escaped it is likewise clean. |
| `node --test test/orphan-cleanup.test.js` → **23/23** | ✅ re-ran: `tests 23 / pass 23 / fail 0` |
| §4.5 regressions → **112/112** across five named suites | ⚠️ **Not re-derived as that standalone five-suite group** (the five are not enumerated in the ledger). **Subsumed:** the full `747/747 · fail 0` run above includes them all with zero failures, which is strictly stronger than the group figure. |
| `bash -n claude/fkit-claude-init.sh` | ✅ syntax OK |
| A6/A7 would go **red** pre-fix; D1 passes pre-fix by design | ✅ verified by reading the assertions — A6's two-way outside `manifest()` freeze and A7's `!/cp: /` + `.gitignore` check cannot hold against the pre-fix tree; D1 is a claim-pin and states so |
| Containment — no stray temp dirs, `git status` clean of test residue | ✅ `git status --porcelain` **identical before and after** every run I made; **zero** `fkit-outside-*` / `fkit-refresh-*` left in `os.tmpdir()`; all 24 of my own `mktemp -d` dirs removed |
| Round-1 text in this ledger left byte-identical | ❌ **NOT re-derivable.** `review.md` is **untracked**, so git holds no baseline to diff against. Content read and consistent with round 1; **byte-identity taken on the build's report.** |
| `0334` and `0335` filed, not re-filed here | ✅ both folders present under `ai-agents/tasks/backlog/`; neither re-raised |

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

**Round 1, processed by a spawned `fkit-coder` Process-review worker under `/fkit-sprint-ship-loop`**
(ADR-032 Decision 3 + the 2026-07-22 autonomy amendment), on the driver's declared-approval marker.
`plan.md` (blob `7b6c5b8dd812211e27dd9a4d390e87019184e1b3`, 30447 bytes) **re-verified against disk
before the first edit** — `git hash-object` and `wc -c` both matched.

⛔ **Owner rulings relayed by the driver, live via `AskUserQuestion` 2026-08-24, labels verbatim:**
**R1 + R2 → "Fix in 0327 — in scope (Recommended)"**; **R3 + R4 → "Fix both in 0327 (Recommended)"**;
the launcher fail-safe dereference → **"File it as its own task (Recommended)"** (⛔ not this task).
**R5 was not ruled on** — dispositioned on this role's own judgement, below.

**Every finding was re-derived firsthand before it was accepted** — R1 and R2 by executed
reproduction in `mktemp -d` dirs outside the repo, R3 and R4 by reading the code. Severity is this
role's own call, traced from blast radius, not inherited from the reviewer's label. **All five agree
with the reviewer's label**, which is recorded as a result, not a deference.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT (sev **high**, agreed) | Defect | Guard the `fkit-*` entries themselves: new `skills_entries_contained()` walks each entry with **no trailing slash** on the glob and refuses the skills half through `path_contained ".claude/skills/<entry>" refresh`. Red-first test **A6**. | ✅ done |
| R2 | CORRECT (sev **medium**, agreed; scope narrowed by measurement) | Defect | **Same guard, one fix** — a dangling / non-directory `fkit-*` entry is refused before `cp -R` can reach it. Red-first test **A7**. Behaviour chosen: **refuse the whole skills half, non-fatally**; justified below. | ✅ done |
| R3 | CORRECT (sev **medium**, agreed) | Defect (documentation) | Re-wrote the exclusivity claim at **six** sites — the five the finding names **plus `test/init-intake-guard.test.js:4`**, which carried the same claim and was not listed. New claim written against the code **as it is after R1's fix**. Pinned by new test **D1**. | ✅ done |
| R4 | CORRECT (sev **low**, agreed) | Defect (documentation) | Both citations **repaired durably, not renumbered**: the `:315` coordinate is **deleted** at both sites and replaced with the quoted doctrine fragment, per `durable-citation-anchors.md` (*"A coordinate already known to be wrong is repaired, not annotated"*). | ✅ done |
| R5 | CORRECT (sev **low**, agreed) | Defect (test gap) | **Not ruled on by the owner; closed on this role's own judgement** — the gap is exactly what R1/R2/R3 needed pinning anyway, so closing it separately would have cost a second change. **A6** covers below-the-leaf, **A7** the dangling entry, **D1** the `fkit-`namespace claim C1 deliberately side-steps. | ✅ done |

### Per-finding evidence, re-derived firsthand

**R1 — CORRECT, high. Reproduced independently before any edit.** `ln -s $W/outside/precious
$W/proj/.claude/skills/fkit-evil`, then init: **`precious/` and `data.txt` deleted**, `rc=0`, **empty
stderr**, and stdout announced `• refreshed 7 agents → .claude/agents/, 26 skills → .claude/skills/`.
The `fkit-evil` link was left **dangling** afterwards, exactly as the finding describes.

⛔ **Codex's clearance is re-disproven here, not taken from the ledger.** The mechanism is the glob's
**trailing slash**, not `rm`'s traversal policy: `fkit-*/` resolves the link before `rm` is reached,
so `FTS_PHYSICAL` never applies. That reasoning is now written into the code comment as a
do-not-re-adopt note.

**R2 — CORRECT, medium, and the blast radius is narrower than the finding states.** Measured three
shapes:

| Shape | Pre-fix result |
|---|---|
| dangling `fkit-heal` (a **payload** name) | `cp: …/fkit-heal: Not a directory`, **`rc=1`**, no fkit refusal, `.gitignore` **never created** |
| symlink→**file** `fkit-heal` (payload name) | identical: `rc=1`, same bare `cp` error |
| dangling `fkit-notapayloadname` (**no** collision) | **`rc=0`, harmless** — `cp -R` never lands on it |

**So R2 fires only on a collision with a payload skill name.** That narrows the trigger; it does not
change the severity, because the colliding names are precisely the ones a user is likely to shadow.
**Medium stands** — init aborts and setup is left half-applied, but nothing is destroyed by R2 alone.

⭐ **A fourth shape decided the fix, and it is the reason R1 and R2 are one change rather than two.**
A **live directory** symlink at a **colliding** name (`fkit-heal -> outside/mydata`) would, under an
R1-only fix that merely skipped the `rm`, reach the `cp -R`. **Measured: `cp -R` does NOT write
through it** — it fails `cp: …: Not a directory` and the outside tree is untouched — so an R1-only fix
converts R1's silent destruction into **R2's fatal abort**. Guarding the entry for both statements at
once is the only shape that leaves neither.

**The agents half needs no equivalent, verified rather than assumed.** `rm -f` removes a symlink
**itself**, not its target, and the `cp` that follows lands on a name the `rm` just cleared. Measured
live and dangling, colliding and not: **`rc=0`, outside content byte-intact, a real regular file
installed**. No escape, no abort. Recorded so nobody widens the fix on symmetry alone.

**R3 — CORRECT, medium. Both falsity shapes confirmed; one is closed by R1's fix, one is not.** Shape
(a) — §3 removing an outside tree — **ceases to exist** once R1 lands, so the corrected wording is
written against the post-fix code as instructed. Shape (b) — a **user path squatting the `fkit-`
namespace** deleted and not put back — is **live and unchanged**, and it is what makes every "only
unrecoverable delete" phrasing false. The new claim therefore moves the exclusivity from
*recoverability* to **namespace**: §6 is the only place fkit deletes a path **named from a list rather
than matched by one of its own two `fkit-*` patterns** — which is true, and stays true — with the
`fkit-`squatter caveat stated explicitly beside it rather than implied away.

⚠️ **A sixth site was found and fixed.** `test/init-intake-guard.test.js:4` read *"§6 applies it to
fkit's one unrecoverable delete"* — the same false claim, outside the finding's list of five. A sweep
that repaired five and left the sixth would have re-filed R3 next round.

**R4 — CORRECT, low. Re-derived: the doctrine line is at `:317`**, both citations said `:315`. Repaired
by **removing the number** at both sites rather than re-pointing it — the target is in the same file, a
third party edits it under the citation, and the convention's own remedy for a known-wrong coordinate
is repair. Each now carries the quoted fragment *"is the one test that does not lie, so it has to come
first"*, which is **unique within this file** (the only other occurrence, `:280`, uses a different
wording) and therefore locates the doctrine without a coordinate that can drift again.

**R5 — CORRECT, low. Closed with the same change.** The reviewer is right that the round-1 suite pinned
the guarded leaf and above and nothing below it, and that C1's non-`fkit-` control cannot pin what R3's
new wording rests on. **A6** (below-the-leaf escape), **A7** (dangling entry) and **D1** (a real
`fkit-`named user path deleted and not restored) close all three gaps. **Codex rated this medium; this
role rates it low** — the gap was a missing pin on defects R1–R3, which are themselves now fixed and
pinned, so the residual risk it names is gone rather than merely documented.

### The one behaviour decision, and the alternative that was rejected

**R2's fix refuses the ENTIRE skills half when any `.claude/skills/fkit-*` entry is a symlink** — it
does not skip the single entry. This is a decision, and it is recorded so it is not mistaken for
laziness:

- **Why the whole half:** `cp -R` copies every payload name in **one call**, so skipping one colliding
  destination means unrolling it into a per-skill loop. That is more moving parts guarding a namespace
  that is fkit-managed and gitignored by §5, where a symlink is a **convention violation to report**,
  not a layout to support. The refusal **names the offending entry**, so the user knows which one to move.
- **Rejected — skip only the offending entry:** finest granularity, but it needs either the per-skill
  `cp` loop or a payload-name collision test. The collision test gives **two behaviours for one
  condition**, and the collision set changes whenever a skill is added or renamed.
- **Cost, stated plainly:** one stray symlinked `fkit-*` entry costs the user **all** the fkit skills
  until they move it. That is the same granularity a symlinked `.claude/skills` already carries, and it
  is the safe direction — the alternative to refusing is destroying.
- **The bar is met:** non-fatal, announced on **stderr**, exit status unchanged (owner ruling Q1a), the
  agents half unaffected. Verified end-to-end: `rc=0`, outside tree intact, `.gitignore` still created,
  `• refreshed 7 agents → .claude/agents/` printed alone and truthfully.

⚠️ **This is flagged for an owner disposition rather than settled here.** It is a real tradeoff, not a
mechanical fix, and **nothing has been written to *Accepted residuals* for it** — see the note there.

### Verification — every figure re-run, none carried from the build report

| Check | Result |
|---|---|
| **Red-first, R1** — A6 against the **unmodified** post-build tree | ✅ **RED**: `init rm -rf'd the user's tree through a symlinked .claude/skills/fkit-* entry` |
| **Red-first, R2** — A7 against the **unmodified** post-build tree | ✅ **RED**: `init died on a dangling .claude/skills/fkit-adversarial-review (rc=1)` + `cp: …: Not a directory` |
| The suite after the fix | ✅ **10/10 green** (7 existing + A6 + A7 + D1); C1 unchanged and still green **both** sides of the change |
| `npm run test:unit` | ✅ `tests 747 / pass 747 / fail 0 / suites 24` — **744 + 3**, exactly the new tests |
| `bash test/prove-red.sh` | ✅ **22/22** mutations red at their **named** assertion; steps 0a–0k green; `✓ hard gate PASSED`. **No mutant run was false-reded by the new tests.** |
| §4.3 reference gate | ✅ fixed-string grep for all four target tokens over `claude/`, excluding `orphan-targets` itself → **zero hits**; `node --test test/orphan-cleanup.test.js` → **23/23 green** |
| §4.5 regressions | ✅ the five named suites → `tests 112 / pass 112 / fail 0` |
| `bash -n claude/fkit-claude-init.sh` | ✅ syntax OK |
| Containment | ✅ every dir `mkdtempSync`/`mktemp -d` outside the repo, all removed; **no `fkit-outside-*` / `fkit-refresh-*` left in `os.tmpdir()`**; `git status --porcelain` shows only the intended paths |

⚠️ **The evidence gap the build declared is UNCHANGED and still open.** `test/harness.mjs:160`
hardcodes `INIT` with no env override, so `prove-red.sh` **cannot** reach `fkit-claude-init.sh` and a
mutant init cannot red this suite. **The red-first proof for A6 and A7 is manual**, run by hand against
the pre-fix tree and pasted above. That seam is `0037`'s deliverable and was **not** built here.

### Change surface this round

| File | What changed |
|---|---|
| `claude/fkit-claude-init.sh` | **R1+R2**: new `skills_entries_contained()` + the skills half's guard condition. **R3**: header bullets 3 and 6, §3's header, §6's headline and its two-difference block. **R4**: both `:315` citations repaired durably |
| `claude/orphan-targets` | **R3**: the ⛔ owner-ruling block's exclusivity claim (comment-only, `#`-prefixed, invisible to the parser) |
| `test/init-claude-refresh-guard.test.js` | **+A6, +A7** (red-first) and **+D1** (the pin R3's wording rests on) |
| `test/orphan-cleanup.test.js` | **R3**: header comment only, no assertion changed |
| `test/init-intake-guard.test.js` | **R3**: header comment only (the sixth site), no assertion changed |

⛔ **Untouched, as ruled:** `claude/fkit-claude.sh` (Q1a, and the launcher fail-safe is another task's),
`claude/structure-manifest.tsv` (no regen), `test/prove-red.sh`, `test/harness.mjs`, and every other
task's folder. **Nothing closed or partially fixed in `0328`, `0329`, `0330`, `0332`, `0037`, `0045`.**
**No commit, no push, no `ai-agents/wiki-vault/` write, no task-file move.**

---

**Round 2, processed 2026-08-24 by a spawned `fkit-coder` Process-review worker under
`/fkit-sprint-ship-loop`** (ADR-032 Decision 3 + the 2026-07-22 autonomy amendment), on the driver's
declared-approval marker. `plan.md` (blob `7b6c5b8dd812211e27dd9a4d390e87019184e1b3`, 30447 bytes)
**re-verified against disk before the first edit** — `git hash-object` and `wc -c` both matched.
⛔ **Round 1's text above is untouched** — this round is appended and dated, per this project's
correction discipline.

⛔ **Owner rulings relayed by the driver, live via `AskUserQuestion` 2026-08-24, labels verbatim:**
**R6 → "File as its own task (Recommended)"**; **R7 → "Fold into R6's task (Recommended)"**;
`0327` closeout → **"Close now, R6/R7 filed forward (Recommended)"**; the three stale citations
pointing **into** this file → **"Fold into 0176 (Recommended)"** (⛔ not this task's).

⛔ **NO SOURCE FIX WAS APPLIED THIS ROUND. This round is documentation-only.** Both findings are
owner-ruled to a follow-up task, and **filing it is a producer's act, not this role's.**

**Both findings were re-derived firsthand before they were accepted** — neither was taken from the
driver's prompt or from the reviewer's row. Every shape below was executed in `mktemp -d` dirs outside
the repo. ⚠️ R6's reproduction **destroys the installed payload in the project it runs against**, which
is why it was never pointed at this repo. Severity is this role's own call, traced from blast radius.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R6 | CORRECT (sev **low**, agreed over Codex's medium) | Defect (pre-existing, out of scope) | **None here.** Owner-ruled to its own task — *"File as its own task (Recommended)"*. Recorded as an accepted residual below; the follow-up is a **producer's** to file. | won't fix (frontier) |
| R7 | CORRECT (sev **low**, agreed) | Defect (message quality, pre-existing, out of scope) | **None here.** Owner-ruled folded into R6's task — *"Fold into R6's task (Recommended)"*. Recorded as an accepted residual below; the follow-up is a **producer's** to file. | won't fix (frontier) |

### R6 — CORRECT, low. Every measurement in the row reproduced, and the row is accurate as written.

Executed against the working tree, and again against `git archive HEAD`:

| Shape | Measured result |
|---|---|
| real **directory** `.claude/agents/fkit-x.md`, **already-installed** project | `rm: …/fkit-x.md: is a directory`, **`rc=1`**; installed fkit agents **7 → 0**; the user's own `my-own.md` **survives**; the squatter itself **survives** (`rm -f` failed on it) |
| same, **fresh** project | **`rc=1`**, same message, **`.gitignore` never created** → §5 and §6 confirmed **never ran** |
| real **regular file** `.claude/skills/fkit-adversarial-review` (a **payload** name), fresh project | `cp: …: Not a directory`, **`rc=1`**, **`.gitignore` never created**, squatter survives; 25 of 26 skills had already landed before `cp` failed |
| **`git archive HEAD`**, both shapes | **identical** — `rc=1`, byte-identical messages. ⛔ **Pre-existing, NOT a regression.** Confirmed independently, not carried from the row. |
| **recovery**: move the stray, re-run | **`rc=0`**, agents **restored 0 → 7**, skills **restored 25 → 26**, `.gitignore` created. Fully recoverable, as the row claims. |

**Scope boundaries measured, so the follow-up task inherits them rather than re-deriving them:**

- A real **regular file** at a **non-payload** name (`fkit-notapayloadname`) is **harmless** — `rc=0`, no
  error, and it **survives untouched**. R6 fires only on a **payload-name collision**, exactly as R2 did.
- A real **directory** squatter in **skills** (`fkit-mysquat/`) **is** deleted and not put back — measured
  `rc=0`, gone. So `:531`'s wording holds for *that* shape. R6's narrowing is precise: it is the
  **wrong-type** squatter (a **directory** where a `*.md` **file** is expected in the **agents** half, or a
  **file** where a **directory** is expected in the **skills** half) that is **not removed at all**,
  because init aborts on it.

**Severity — `low` agreed, and this role adds evidence the row did not carry.** Nothing outside the
project is touched, no user-owned path is destroyed (verified: the user's own file *and* both squatters
survive), and the only loss is fkit's own **gitignored** payload, fully restored by moving the stray and
re-running. ⭐ **The worst shape is also the loudest** — the agents wipe is precisely what makes
`ls "$proj"/.claude/agents/fkit-*.md` fail, so it trips the launcher's **hard** fail-safe
(`claude/fkit-claude.sh:387`, gated on `setup_ok = 0` **and** no agents on disk): *"fkit has no agents
installed here, so there is no session to start"*, **exit 1**. There is **no silent success** in any shape.

⚠️ **One disambiguation, offered as a refinement rather than a correction — the row's verdict stands.**
The row says `rc=1` *"routes to the launcher's `setup_ok` fail-safe"*. That is true of **both** halves,
but they reach **different** branches: the **skills** shape leaves the agents installed, so it does
**not** reach the hard `:387` exit — it gets the loud stderr warning at `claude/fkit-claude.sh:372`
(*"fkit could not finish setting up this project… agents, skills, or the ai-agents/ tree"*) and the
session **starts** with a **partial** skill set. Under ADR-010 role-locking a missing skill is a
procedure the role cannot run. Still **low** — announced, non-destructive, recoverable — but the
follow-up task should know the two halves fail **loudly in different ways**, not identically.

### R7 — CORRECT, low. Reproduced, including the one-re-run-at-a-time discovery.

**Measured** with two symlinked entries (`fkit-aaa`, `fkit-zzz`) pointing at two outside trees:

- Refusal named **`fkit-aaa` only**; `fkit-zzz` appeared **0 times** in the whole output.
- After removing `fkit-aaa` and re-running, `fkit-zzz` was named — **confirming the row's
  "one re-run at a time"** claim by execution, not inference.
- The path line printed `…/p/.claude/skills` — the **real parent** — directly above *"Replace the
  symlinked path with a real directory"*, exactly as the row states.
- ✅ **Nothing was destroyed**: `rc=0`, **both** outside trees byte-intact, **both** user links left
  exactly as found, the **agents** half ran normally (`• refreshed 7 agents → .claude/agents/`, printed
  alone and truthfully). The half is correctly refused; only the **message** is short.

**Coordinates verified, not assumed:** the rationale R7 measures the fix against is at **`:574`** —
*"The message names the offending entry so the user knows which one to move."* `skills_entries_contained()`
is at **`:578`**, its unconditional `return 1` on the first `[ -L ]` hit at **`:583`**; the refusal block
is at **`:606-612`**. All as cited.

⚠️ **This role confirms R7 is NOT a re-raise of the owner-ruled granularity residual.** The ruling settles
**how much** is refused; R7 is about **what the refusal says**. Different question, and it is measured
against the fix's **own** stated rationale at `:574`.

⭐ **A refinement the follow-up task needs, or it will introduce a bug fixing R7.** The path line is not
simply "wrong" — **one message block at `:606-612` serves two different triggers**, and the path is
**correct** for the other one. When `.claude/skills` **itself** is the symlink (caught by
`path_contained ".claude/skills"` at `:605`), `$dest/.claude/skills` **is** the offending path and the
sentence reads correctly. It is only wrong when the trigger is `skills_entries_contained()`. ⛔ **So a fix
that just re-points that line breaks the case that works today** — the two triggers need distinguishing,
not the line rewriting.

### Verification of the reviewer's own two self-flagged limits — both judged honestly bounded

- **§4.5's 112/112 five-suite group, "not re-derived as that standalone group."** ✅ **Agreed, and the
  reviewer's reasoning is right.** The group is a **subset** of `npm run test:unit`, which the reviewer
  **did** re-run at **747/747, fail 0**. A zero-failure run over the superset is **strictly stronger**
  than the subset figure: it cannot be true while any of the 112 fails. The only thing lost is the
  *count* attribution, which is a bookkeeping detail, not a claim about correctness. **Honestly bounded,
  and the flag is more conservative than it needed to be.**
- **Round-1 ledger byte-identity, "not re-derivable — `review.md` is untracked."** ✅ **Agreed, and
  confirmed structurally rather than merely accepted.** `review.md` is untracked, so git genuinely holds
  no baseline and no diff is possible — the limit is real, not laziness. What **can** be checked was
  checked by this role and holds: exactly **one** each of the three `##` sections (`:10`, `:124`,
  `:272`), **zero** live round-1 queue sentinels, and **no** `R6`/`R7` row in *Coder response* before
  this append. Taking byte-identity on report while proving the **structural** invariants is the right
  bound. ⚠️ **The durable lesson is upstream of this round: an untracked ledger has no baseline, so
  "unchanged" can never be more than a report.**

### R4's closure — confirmed by this role, because it is the pattern this project keeps re-learning

⭐ **R4 was closed by DELETING the coordinate, not renumbering it, and round 2 proved that choice correct
by accident of timing.** Re-verified firsthand on the working tree: the doctrine line has now moved
**again**, `:315` → `:317` → **`:319`**, and **both** repaired citations (**`:534`**, **`:637`**) are
**still correct**, because they carry the quoted fragment *"is the one test that does not lie, so it has
to come first"* and **no number at all**. **Zero `:315` coordinates survive** anywhere in the file.
⛔ **A renumber-to-`:317` fix would be stale right now, one round later.** This is the concrete case for
`durable-citation-anchors.md`'s rule — *a coordinate already known to be wrong is repaired, not
annotated* — and the repair that survives is the one that **removes the coordinate**, not the one that
corrects it.

### Change surface this round

| File | What changed |
|---|---|
| `ai-agents/tasks/backlog/0327-…/review.md` | **This *Coder response* round-2 append**, the two residual entries added **in place** in the existing *Accepted residuals* section, and header `Status:` → `closed-out` |
| `ai-agents/tasks/backlog/0327-…/worklog.md` | Round-2 dispositions, `none` for fixes applied, and the R6/R7 verification record |

⛔ **NO source file was edited this round.** `claude/fkit-claude-init.sh`, `claude/fkit-claude.sh`,
`claude/orphan-targets`, `claude/structure-manifest.tsv` (**not** regenerated) and every test file are
**untouched** — verified by `git status --porcelain`. **No board touched** (`ai-agents/sprints/` — a
producer is running there concurrently), **no other task's folder touched**, **no task-file move**,
**no commit, no push, no `ai-agents/wiki-vault/` write.**

## Accepted residuals (shared, do-not-re-litigate)

✅ **The round-1 queue block that stood here has been CONVERTED IN PLACE by the reviewer's round-2 pass,
2026-08-24 — not appended beside.** Its one item awaiting an owner ruling now has one and is written below
as a proper residual; its two other items were pointers to dispositions made elsewhere and are kept below
the line as pointers, which is what they always were. **Nothing was duplicated and nothing was dropped.**

- **Whole-half refusal granularity at §3's skills half** — ⛔ **OWNER-RULED 2026-08-24, verbatim label
  "Keep whole-half refusal (Recommended)". Settled. Not a finding to re-open.**
  · **What:** when **any** `.claude/skills/fkit-*` entry is a symlink, init refuses the **entire** skills
  half — it does not skip the one offending entry. Non-fatal: it warns on **stderr**, leaves the user's
  link exactly as found, leaves the **agents** half to run normally, and init's exit status is unchanged.
  · **Why (structural):** `cp -R` copies every payload name in a **single call**, so skipping one
  colliding destination means unrolling it into a per-skill `cp` loop. That is more moving parts guarding
  a namespace that is fkit-managed and **gitignored by §5**, where a symlink is a **convention violation
  to report, not a layout to support**. **Rejected alternative — skip only the offending entry:** finest
  granularity, but it needs either that per-skill loop or a payload-name **collision test**; the collision
  test gives **two behaviours for one condition**, and the collision set changes every time a skill is
  added or renamed. **Cost, stated plainly and accepted:** one stray symlinked `fkit-*` entry costs the
  user **all** the fkit skills until they move it. That is the same granularity a symlinked
  `.claude/skills` already carries, and it is the **safe direction** — the alternative to refusing is
  destroying.
  · **Re-raise only if:** the whole-half refusal is shown to **destroy or corrupt** something, rather
  than merely skipping more than strictly necessary. ⛔ *"It refuses too much"* is **not** a re-raise
  condition — that is the ruling. ⚠️ **R7 is NOT a re-raise of this residual**: R7 is about the refusal
  **message** naming only the first of several offenders and pointing its path line at the real parent,
  which is a gap against the fix's **own** stated rationale (`fkit-claude-init.sh:574-575`), not against
  this granularity ruling.

✅ **Two entries ADDED IN PLACE below by the coder's round-2 pass, 2026-08-24** — extending this existing
section, **not** a second one. Nothing above was rewritten, reworded or dropped.

- **Wrong-type (non-symlink) squatter aborts init — R6** — ⛔ **OWNER-RULED 2026-08-24, verbatim label
  "File as its own task (Recommended)". Settled for `0327`. Not a finding to re-open here.**
  · **What:** the §3 guard tests `[ -L ]` only, so a **real directory** at `.claude/agents/fkit-<x>.md`
  or a **real regular file** at `.claude/skills/<payload-skill-name>` passes it and kills init with
  **`rc=1`** under `set -euo pipefail` — `rm: …: is a directory` / `cp: …: Not a directory` — so §5 and
  §6 never run. On an **already-installed** project the agents shape wipes the installed `fkit-*.md`
  agents **before** failing, and `cp` never runs, leaving **zero** fkit agents.
  · **Why (structural):** ⛔ **PRE-EXISTING at `HEAD` — verified byte-identical, not a regression** — and
  **outside `0327`'s deliverable**, which is refusing the refresh through a **symlink**. Fixing it here
  would widen an approved plan mid-flight. **Priced `low` and the price is measured:** nothing outside
  the project is touched, **no user-owned path is destroyed** (the user's own file *and* the squatter
  itself both survive), the only loss is fkit's own **gitignored** payload, and it is **fully recovered**
  by moving the stray and re-running (measured: agents 0 → 7, skills 25 → 26, `.gitignore` created).
  `rc=1` reaches a `setup_ok`-gated branch in the launcher rather than a silent success — the agents
  shape trips the **hard** fail-safe (`claude/fkit-claude.sh:387`, exit 1), the skills shape the loud
  warning (`:372`) with a **partial** skill set. **Rejected alternative — fix it inside `0327`:** it is a
  different defect class (wrong **type**, not symlink), it needs its own red-first pins, and the owner
  ruled the scope explicitly.
  · **Re-raise only if:** it is shown to destroy a **user-owned** path or **anything outside the
  project**, or to fail **silently** (no `rc=1`, no launcher warning). ⛔ *"init still aborts on a
  wrong-type squatter"* is **not** a re-raise condition — that is the known, filed state.
  ⚠️ **Filing the follow-up task is a PRODUCER's act, not this role's.** ✅ **Now filed as `0336`**
  (`ai-agents/tasks/backlog/0336-guard-inits-claude-refresh-against-a-wrong-type-squatter-and-name-every-symlinked-entry/`)
  — folder confirmed present and its brief read (read-only) as carrying **both** R6 and R7.
  ⛔ **Do not re-file, and do not fix it under `0327`.**

- **Refusal names only the first offender, and its path line serves two triggers — R7** — ⛔ **OWNER-RULED
  2026-08-24, verbatim label "Fold into R6's task (Recommended)". Settled for `0327`. Not a finding to
  re-open here.**
  · **What:** `skills_entries_contained()` (`claude/fkit-claude-init.sh:578`) `return 1`s on the **first**
  `[ -L ]` hit, so with several symlinked `fkit-*` entries the refusal names **one** and the user
  discovers the rest **one re-run at a time** (measured: `fkit-aaa` named, `fkit-zzz` named **0** times
  until `fkit-aaa` was removed). The path line at `:606-612` prints the **real parent**
  `$dest/.claude/skills` directly above *"Replace the symlinked path with a real directory"*.
  · **Why (structural):** ⛔ **PRE-EXISTING and non-destructive** — `rc=0`, both outside trees
  byte-intact, both user links left as found, the agents half unaffected, and the whole skills half
  **correctly refused**. It is a **message-quality** gap against the fix's **own** stated rationale at
  `:574` (*"The message names the offending entry"*), not a safety gap. ⚠️ **NOT a re-raise of the
  granularity ruling above** — that ruling settles **how much** is refused; this is **what the refusal
  says**. **Rejected alternative — fix the path line inside `0327`:** ⛔ it would **introduce** a bug.
  **One message block at `:606-612` serves two triggers**, and the path is **correct** for the other one
  — when `.claude/skills` **itself** is the symlink, `$dest/.claude/skills` **is** the offending path.
  The two triggers must be distinguished, which is a design change, not a one-line edit.
  · **Re-raise only if:** the refusal is shown to name a **wrong** entry (as opposed to an **incomplete**
  set), or to leave the user with **no** way to find the remaining offenders. ⛔ *"it names only one of
  several"* is **not** a re-raise condition — that is the known, filed state.
  ⚠️ **Folded into R6's follow-up task, which is a PRODUCER's to file.** ✅ **Now filed as part of
  `0336`** — confirmed by reading that brief (read-only); it carries R7 alongside R6.
  ⛔ Do not re-file separately.

**Pointers, not residuals — dispositioned elsewhere, listed only so they are not re-derived or re-filed:**

- **TOCTOU at §3** — already recorded **in-file** in §6's `ACCEPTED RESIDUALS — owner-ruled 2026-07-17`
  block and inherited by §4 in `0046`. §3's guard inherits it and does **not** widen it — re-checked in
  round 2: the new entry walk is the same `[ -L ]`-then-act shape as §4 and §6, so the window is
  unchanged. **Nothing owed here.**
- **The launcher's symlink-blind agents fail-safe** — **⛔ NOT this task's.** Owner ruled it a task of its
  own, verbatim label **"File it as its own task (Recommended)"**, 2026-08-24; now filed as **`0334`**.
  ⛔ **Do not re-file.** ⚠️ **Its MECHANISM is deliberately not restated here** — `0335` exists to correct
  how that mechanism is described across `0327`'s existing records, and repeating the wording here would
  add another record for it to repair.
- **Wrong `ls dereferences` mechanism wording in `0327`'s records** — filed as **`0335`**. ⛔ Do not re-file.
- **`prove-red.sh` cannot reach `fkit-claude-init.sh`** (`test/harness.mjs:160` hardcodes `INIT`, no env
  override), so the red-first proof for A6/A7 is **manual, not mechanized**. `0037`'s deliverable,
  deliberately not built here. **Known gap — do not re-raise as a finding.**
- **The three stale citations pointing INTO `fkit-claude-init.sh` from elsewhere** —
  `test/structure-manifest.test.js:27` and `:253`, and `claude/skills/fkit-heal/check.sh:40`, citing
  `:374` / `:366-372` for `marker_lines()`. ⛔ **Already wrong at `HEAD` — NOT broken by this diff**, so
  not R4's class. ⛔ **NOT this task's:** owner-ruled 2026-08-24, verbatim label
  **"Fold into 0176 (Recommended)"**. ⚠️ A producer is working `0176` concurrently. ⛔ Do not re-file,
  and do not repair them here.
- **Exit status unchanged on a §3 refusal** — owner ruling **Q1(a)**, with the accepted consequence that a
  **fresh** project with a symlinked `.claude` fails at session start with Claude Code's own *"agent not
  found"* rather than fkit's. Re-raise only with a **new** consequence.
